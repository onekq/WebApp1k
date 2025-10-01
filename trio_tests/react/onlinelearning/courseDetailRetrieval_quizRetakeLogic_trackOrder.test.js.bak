import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseDetailRetrieval_quizRetakeLogic_trackOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Course Detail Retrieval success: should display course details.', async () => {
  fetchMock.get('/api/courses/1', { id: 1, title: 'React Course', details: 'Detailed info' });

  await act(async () => { render(<MemoryRouter><CourseDetail courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Detailed info')).toBeInTheDocument();
}, 10000);

test('Course Detail Retrieval failure: should display an error message on failed detail retrieval.', async () => {
  fetchMock.get('/api/courses/1', 404);

  await act(async () => { render(<MemoryRouter><CourseDetail courseId={1} /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Course details cannot be retrieved.')).toBeInTheDocument();
}, 10000);

test('Success: quiz retake works properly', async () => {
  fetchMock.post('/api/quiz-retake', 200);

  await act(async () => { render(<MemoryRouter><QuizRetakeLogicComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake successful')).toBeInTheDocument();
}, 10000);

test('Failure: quiz retake fails', async () => {
  fetchMock.post('/api/quiz-retake', 500);

  await act(async () => { render(<MemoryRouter><QuizRetakeLogicComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake failed')).toBeInTheDocument();
}, 10000);

test('Successfully tracks order status', async () => {
  fetchMock.get('/order/status', { status: 200, body: { status: 'Shipped' } });

  await act(async () => { render(<MemoryRouter><TrackOrder /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shipped')).toBeInTheDocument();
}, 10000);

test('Fails to track order status', async () => {
  fetchMock.get('/order/status', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><TrackOrder /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tracking failed')).toBeInTheDocument();
}, 10000);
