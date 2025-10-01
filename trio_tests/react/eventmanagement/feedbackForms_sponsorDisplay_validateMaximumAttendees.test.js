import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './feedbackForms_sponsorDisplay_validateMaximumAttendees';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Displays feedback form post-event', async () => {
  fetchMock.get('/api/event/feedback', { form: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
}, 10000);

test('Displays error message when feedback form is unavailable post-event', async () => {
  fetchMock.get('/api/event/feedback', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Feedback form is unavailable')).toBeInTheDocument();
}, 10000);

test('Displays sponsors and partners on event pages', async () => {
  fetchMock.get('/api/event/sponsors', { sponsors: ['Sponsor 1', 'Sponsor 2'], partners: ['Partner 1'] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sponsor 1')).toBeInTheDocument();
  expect(screen.getByText('Partner 1')).toBeInTheDocument();
}, 10000);

test('Displays error message when sponsors and partners are unavailable', async () => {
  fetchMock.get('/api/event/sponsors', 404);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Sponsors and partners are unavailable')).toBeInTheDocument();
}, 10000);

test('Should successfully submit valid maximum attendees count', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '100' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for negative maximum attendees count', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/maximum attendees/i), { target: { value: '-1' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/maximum attendees must be a positive number/i)).toBeInTheDocument();
}, 10000);
