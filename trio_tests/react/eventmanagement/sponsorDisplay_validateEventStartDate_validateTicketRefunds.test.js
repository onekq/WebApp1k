import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './sponsorDisplay_validateEventStartDate_validateTicketRefunds';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


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

test('Should successfully submit valid event start date', async () => {
  fetchMock.post('/events', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2023-12-12T10:00' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('success-message')).toBeInTheDocument();
}, 10000);

test('Should show error for past event start date', async () => {
  fetchMock.post('/events', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2022-12-12T10:00' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/submit/i)); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText(/start date cannot be in the past/i)).toBeInTheDocument();
}, 10000);

test('processes ticket refund successfully', async () => {
  fetchMock.post('/processRefund', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(fetchMock.calls('/processRefund').length).toEqual(1);
  expect(screen.getByText('Refund processed')).toBeInTheDocument();
}, 10000);

test('fails to process ticket refund', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('refundButton')); });

  expect(screen.getByText('Unable to process refund.')).toBeInTheDocument();
}, 10000);
