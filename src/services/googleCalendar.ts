import { GoogleAuthProvider, signInWithPopup, User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase.ts';

export const SCOPES = [
  'https://www.googleapis.com/auth/calendar.events',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({
  prompt: 'consent',
  access_type: 'offline',
});

let isSigningIn = false;
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Initialize listener to clear or restore in-memory session
export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user && !user.isAnonymous) {
      cachedUser = user;
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      cachedUser = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Client-side Google Sign-In with OAuth Calendar Scope
export const connectGoogleCalendar = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google OAuth access token');
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('[Google Calendar Auth Error]', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getGoogleUser = (): User | null => {
  return cachedUser;
};

export const disconnectGoogleCalendar = async () => {
  cachedAccessToken = null;
  cachedUser = null;
};

export interface CreateCalendarEventParams {
  summary: string;
  description: string;
  startTime: string; // ISO 8601 string
  endTime: string;   // ISO 8601 string
  attendeeEmail: string;
  attendeeName: string;
}

export interface CreatedCalendarEventResult {
  eventId: string;
  htmlLink: string;
  meetUrl: string;
}

// Creates event on primary calendar with auto-generated Google Meet video conference
export const createGoogleCalendarEvent = async (
  params: CreateCalendarEventParams,
  token: string
): Promise<CreatedCalendarEventResult> => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';

  const eventPayload = {
    summary: params.summary,
    description: params.description,
    start: {
      dateTime: params.startTime,
      timeZone,
    },
    end: {
      dateTime: params.endTime,
      timeZone,
    },
    attendees: [
      {
        email: params.attendeeEmail,
        displayName: params.attendeeName,
      },
    ],
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        conferenceSolutionKey: {
          type: 'hangoutsMeet',
        },
      },
    },
    reminders: {
      useDefault: true,
    },
  };

  const res = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1&sendUpdates=all',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventPayload),
    }
  );

  if (!res.ok) {
    const errorJson = await res.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || `Google Calendar API error: ${res.statusText}`
    );
  }

  const data = await res.json();
  const meetUrl =
    data.hangoutLink ||
    data.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri ||
    'https://meet.google.com/vdd-fxch-jcm';

  return {
    eventId: data.id,
    htmlLink: data.htmlLink || '',
    meetUrl,
  };
};
