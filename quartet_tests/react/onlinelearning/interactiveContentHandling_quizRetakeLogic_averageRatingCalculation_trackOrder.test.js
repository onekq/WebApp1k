import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './interactiveContentHandling_quizRetakeLogic_averageRatingCalculation_trackOrder';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Success: interactive content loads successfully (from interactiveContentHandling_quizRetakeLogic)', async () => {
  fetchMock.get('/api/interactive-content', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Interactive content loaded')).toBeInTheDocument();
}, 10000);

test('Failure: interactive content fails to load (from interactiveContentHandling_quizRetakeLogic)', async () => {
  fetchMock.get('/api/interactive-content', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading interactive content')).toBeInTheDocument();
}, 10000);

test('Success: quiz retake works properly (from interactiveContentHandling_quizRetakeLogic)', async () => {
  fetchMock.post('/api/quiz-retake', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake successful')).toBeInTheDocument();
}, 10000);

test('Failure: quiz retake fails (from interactiveContentHandling_quizRetakeLogic)', async () => {
  fetchMock.post('/api/quiz-retake', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('retake-quiz-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Quiz retake failed')).toBeInTheDocument();
}, 10000);

test('Average rating is calculated correctly for a course. (from averageRatingCalculation_trackOrder)', async () => {
  fetchMock.get('/api/courses/ratings', { average: 4.5 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/average rating/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when rating calculation fails. (from averageRatingCalculation_trackOrder)', async () => {
  fetchMock.get('/api/courses/ratings', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  
  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to calculate average rating/i)).toBeInTheDocument();
}, 10000);

test('Successfully tracks order status (from averageRatingCalculation_trackOrder)', async () => {
  fetchMock.get('/order/status', { status: 200, body: { status: 'Shipped' } });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shipped')).toBeInTheDocument();
}, 10000);

test('Fails to track order status (from averageRatingCalculation_trackOrder)', async () => {
  fetchMock.get('/order/status', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Track Order')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Tracking failed')).toBeInTheDocument();
}, 10000);

