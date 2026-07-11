import { prisma } from "@/lib/prisma";
import type { InterviewType } from "@prisma/client";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type InterviewFeedback = {
  score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestedTopics: string[];
};

export const INTERVIEW_TYPE_LABELS: Record<InterviewType, string> = {
  DSA: "DSA Coding",
  SYSTEM_DESIGN: "System Design",
  BEHAVIORAL: "Behavioral",
};

/** All interview sessions for a user, newest first. */
export async function listInterviews(userId: string) {
  return prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      type: true,
      status: true,
      title: true,
      score: true,
      createdAt: true,
      completedAt: true,
    },
  });
}

/** One session, only if owned by the user. */
export async function getInterview(userId: string, id: string) {
  return prisma.interviewSession.findFirst({
    where: { id, userId },
  });
}

export function parseMessages(json: unknown): ChatMessage[] {
  if (!Array.isArray(json)) return [];
  return json as ChatMessage[];
}

export function parseFeedback(json: unknown): InterviewFeedback | null {
  if (!json || typeof json !== "object") return null;
  const f = json as Partial<InterviewFeedback>;
  if (typeof f.score !== "number" || typeof f.summary !== "string") return null;
  return {
    score: f.score,
    summary: f.summary,
    strengths: Array.isArray(f.strengths) ? f.strengths.map(String) : [],
    gaps: Array.isArray(f.gaps) ? f.gaps.map(String) : [],
    suggestedTopics: Array.isArray(f.suggestedTopics)
      ? f.suggestedTopics.map(String)
      : [],
  };
}

export async function createInterview(
  userId: string,
  type: InterviewType,
  title: string,
  firstMessage: ChatMessage
) {
  return prisma.interviewSession.create({
    data: { userId, type, title, messages: [firstMessage] },
  });
}

export async function saveMessages(id: string, messages: ChatMessage[]) {
  return prisma.interviewSession.update({
    where: { id },
    data: { messages },
  });
}

export async function completeInterview(
  id: string,
  feedback: InterviewFeedback
) {
  return prisma.interviewSession.update({
    where: { id },
    data: {
      status: "COMPLETED",
      feedback,
      score: feedback.score,
      completedAt: new Date(),
    },
  });
}
