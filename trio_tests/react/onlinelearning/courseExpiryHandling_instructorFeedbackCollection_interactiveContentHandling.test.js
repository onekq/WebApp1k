import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './courseExpiryHandling_instructorFeedbackCollection_interactiveContentHandling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully handles course expiry and re-enrollment', async () => {
  fetchMock.post('/courses/expire', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment successful')).toBeInTheDocument();
}, 10000);

test('Fails to handle course expiry and re-enrollment', async () => {
  fetchMock.post('/courses/expire', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment failed')).toBeInTheDocument();
}, 10000);

test('Feedback from instructors about course content is collected.', async () => {
  fetchMock.post('/api/instructors/feedback', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/content feedback/i), { target: { value: 'Well-structured course!' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/feedback submitted/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when instructor feedback submission fails.', async () => {
  fetchMock.post('/api/instructors/feedback', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/content feedback/i), { target: { value: 'Could be better.' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit feedback/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to submit feedback/i)).toBeInTheDocument();
}, 10000);

test('Success: interactive content loads successfully', async () => {
  fetchMock.get('/api/interactive-content', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Interactive content loaded')).toBeInTheDocument();
}, 10000);

test('Failure: interactive content fails to load', async () => {
  fetchMock.get('/api/interactive-content', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  await act(async () => { fireEvent.click(screen.getByTestId('load-interactive-content')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Error loading interactive content')).toBeInTheDocument();
}, 10000);
