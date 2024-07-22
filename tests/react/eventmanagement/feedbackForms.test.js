import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import EventApp from './feedbackForms';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Displays feedback form post-event', async () => {
  fetchMock.get('/api/event/feedback', { form: true });

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
}, 10000);

test('Displays error message when feedback form is unavailable post-event', async () => {
  fetchMock.get('/api/event/feedback', 404);

  await act(async () => { render(<MemoryRouter><EventApp /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Feedback form is unavailable')).toBeInTheDocument();
}, 10000);

