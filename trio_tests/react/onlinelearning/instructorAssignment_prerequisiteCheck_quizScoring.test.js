import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './instructorAssignment_prerequisiteCheck_quizScoring';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Instructor Assignment success: should display assigned instructor.', async () => {
  fetchMock.post('/api/assign-instructor', { success: true });

  await act(async () => { render(<MemoryRouter><InstructorAssignment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Instructor successfully assigned.')).toBeInTheDocument();
}, 10000);

test('Instructor Assignment failure: should display an error message on assignment failure.', async () => {
  fetchMock.post('/api/assign-instructor', 400);

  await act(async () => { render(<MemoryRouter><InstructorAssignment /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByPlaceholderText('Instructor ID'), { target: { value: '1' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Assign')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to assign instructor.')).toBeInTheDocument();
}, 10000);

test('Enrollment is allowed after prerequisites are met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: true });
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Enrollment is blocked if prerequisites are not met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: false });

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(0);
  expect(screen.getByText(/Cannot enroll, prerequisites not met/i)).toBeInTheDocument();
}, 10000);

test('Quiz scoring is calculated correctly.', async () => {
  fetchMock.post('/api/quiz/score', { score: 85 });

  await act(async () => { render(<MemoryRouter><Quiz /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'correct answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/your score/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when quiz scoring fails.', async () => {
  fetchMock.post('/api/quiz/score', 500);

  await act(async () => { render(<MemoryRouter><Quiz /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: 'wrong answer' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/error/i)).toBeInTheDocument();
}, 10000);
