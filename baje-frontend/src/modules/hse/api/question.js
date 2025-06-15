import api from "api/appAxios";
import { omit } from "lodash";
import { endPoints } from "../constant";

/**
 *
 * @param {object} question -question object
 * @param {string} question.group -group of question
 * @param {string} question.type -type of question
 * @param {string} question.quesiton -question content
 * @param {boolean} question.isReverse -isreverse in nomredehi
 * @returns
 */
export const createQuestion = (question) =>
  api.post(endPoints.questions.base, question);

export const getQuestions = () => api.get(endPoints.questions.base);

export const deleteQuestion = (question) =>
  api.delete(`${endPoints.questions.base}/${question.id}`);

/**
 *
 * @param {object} question - question object
 * @param {string} question.group - group of question
 * @param {string} question.type - type of question
 * @param {string} question.quesiton - question content
 * @param {number} question.id - question id
 * @returns
 */
export const updateQuestion = (question) =>
  api.patch(
    `${endPoints.questions.base}/${question.id}`,
    omit(question, ["id", "code"])
  );
