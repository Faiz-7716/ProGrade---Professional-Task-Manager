
'use server';

import {
  generateAboutSection,
  GenerateAboutSectionInput,
} from '@/ai/flows/generate-about-section';
import {
  generateLinkedInPost,
  GenerateLinkedInPostInput,
} from '@/ai/flows/generate-linkedin-post';
import {
    generateQuiz,
    GenerateQuizInput,
  } from '@/ai/flows/generate-quiz';
import {
    generateQuizTitle,
    GenerateQuizTitleInput,
} from '@/ai/flows/generate-quiz-title';
import {
  parseResume,
  ParseResumeInput,
} from '@/ai/flows/parse-resume';
import {
  provideDailyGrowthSuggestions,
  ProvideDailyGrowthSuggestionsInput,
} from '@/ai/flows/provide-daily-growth-suggestions';
import {
  provideJournalFeedback,
  ProvideJournalFeedbackInput,
} from '@/ai/flows/provide-journal-feedback';
import {
  suggestHeadline,
  SuggestHeadlineInput,
} from '@/ai/flows/suggest-headline';
import {
  suggestHashtags,
  SuggestHashtagsInput,
} from '@/ai/flows/suggest-hashtags';

const handleActionError = (e: unknown) => {
  const errorMessage =
    e instanceof Error ? e.message : 'An unknown error occurred.';
  console.error(errorMessage);
  return { error: 'Failed to get a response from the AI. Please try again.' };
};

export async function suggestHeadlineAction(input: SuggestHeadlineInput) {
  try {
    const result = await suggestHeadline(input);
    return { headline: result.headline };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function generateAboutSectionAction(
  input: GenerateAboutSectionInput
) {
  try {
    const result = await generateAboutSection(input);
    return { aboutSection: result.aboutSection };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function generatePostAction(input: GenerateLinkedInPostInput) {
  try {
    const result = await generateLinkedInPost(input);
    return { post: result.post };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function suggestHashtagsAction(input: SuggestHashtagsInput) {
  try {
    const result = await suggestHashtags(input);
    return { hashtags: result.hashtags };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function getDailyGrowthSuggestionsAction(
  input: ProvideDailyGrowthSuggestionsInput
) {
  try {
    const result = await provideDailyGrowthSuggestions(input);
    return { suggestions: result.growthSuggestions };
  } catch (e) {
    return handleActionError(e);
  }
}

export async function parseResumeAction(input: ParseResumeInput) {
  try {
    const result = await parseResume(input);
    return result;
  } catch (e) {
    return handleActionError(e);
  }
}

export async function generateQuizAction(input: GenerateQuizInput) {
    try {
      const result = await generateQuiz(input);
      return { quiz: result };
    } catch (e) {
      return handleActionError(e);
    }
  }

export async function generateQuizTitleAction(input: GenerateQuizTitleInput) {
    try {
        const result = await generateQuizTitle(input);
        return result;
    } catch (e) {
        return handleActionError(e);
    }
}

export async function provideJournalFeedbackAction(input: ProvideJournalFeedbackInput) {
    try {
        const result = await provideJournalFeedback(input);
        return result;
    } catch (e) {
        return handleActionError(e);
    }
}
