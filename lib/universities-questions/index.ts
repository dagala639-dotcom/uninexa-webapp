import { torontoQuestions } from "./toronto";
import { munichQuestions } from "./munich";
import { oxfordQuestions } from "./oxford";
import { cambridgeQuestions } from "./cambridge";
import { melbourneQuestions } from "./melbourne";
import { sydneyQuestions } from "./sydney";
import { monashQuestions } from "./monash";
import { queenslandQuestions } from "./queensland";
import { rmitQuestions } from "./rmit";
import { mcgillQuestions } from "./mcgill";
import { ubcQuestions } from "./ubc";
import { albertaQuestions } from "./alberta";
import { victoriaQuestions } from "./victoria";
import { manchesterQuestions } from "./manchester";
import { leedsQuestions } from "./leeds";
import { queensBelfastQuestions } from "./queens-belfast";
import { heidelbergQuestions } from "./heidelberg";
import { elteQuestions } from "./elte";
import { debrecenQuestions } from "./debrecen";
import { asuQuestions as arizonaStateQuestions } from "./asu";

export type UniversityQuestion = {
  id: string;
  type: string;
  label?: string;
  question?: string;
  required?: boolean;
  options?: string[];
  placeholder?: string;
};

type UniversityQuestions = Record<string, UniversityQuestion[]>;

export function getUniversityQuestions(
  universityName: string | null | undefined
): UniversityQuestions {
  const name = universityName?.toLowerCase().trim();

  if (name === "university of toronto") {
    return torontoQuestions;
  }

  if (
    name === "technical university of munich" ||
    name === "tum"
  ) {
    return munichQuestions;
  }

  if (name === "university of oxford") {
    return oxfordQuestions;
  }

  if (name === "university of cambridge") {
    return cambridgeQuestions;
  }

  if (name === "university of melbourne") {
    return melbourneQuestions;
  }

  if (name === "university of sydney") {
    return sydneyQuestions;
  }

  if (name === "monash university") {
    return monashQuestions;
  }

  if (name === "university of queensland") {
    return queenslandQuestions;
  }

  if (name === "rmit university") {
    return rmitQuestions;
  }

  if (name === "mcgill university") {
    return mcgillQuestions;
  }

  if (name === "university of british columbia") {
    return ubcQuestions;
  }

  if (name === "university of alberta") {
    return albertaQuestions;
  }

  if (name === "university of victoria") {
    return victoriaQuestions;
  }

  if (name === "university of manchester") {
    return manchesterQuestions;
  }

  if (name === "university of leeds") {
    return leedsQuestions;
  }

  if (name === "queen's university belfast") {
    return queensBelfastQuestions;
  }

  if (name === "university of heidelberg") {
    return heidelbergQuestions;
  }

  if (name === "eötvös loránd university") {
    return elteQuestions;
  }

  if (name === "university of debrecen") {
    return debrecenQuestions;
  }

  if (name === "arizona state university") {
    return arizonaStateQuestions;
  }

  return torontoQuestions;
}
