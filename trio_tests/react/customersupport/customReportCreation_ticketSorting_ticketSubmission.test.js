import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './customReportCreation_ticketSorting_ticketSubmission';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully creates custom reports.', async () => {
  fetchMock.post('/api/report/custom', {
    status: 200,
    body: { success: true, data: { reportId: '123' }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-name-input'), { target: { value: 'Test Report' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('create-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Report created')).toBeInTheDocument();
}, 10000);

test('Fails to create custom reports and shows error message.', async () => {
  fetchMock.post('/api/report/custom', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('report-name-input'), { target: { value: 'Test Report' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('create-custom-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('sorts tickets by submission date', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', { status: 200, body: [{ id: 2, date: '2023-01-01' }, { id: 1, date: '2023-01-02' }] });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('2023-01-01')).toBeInTheDocument();
  expect(screen.getByText('2023-01-02')).toBeInTheDocument();
}, 10000);

test('shows error if sorting tickets fails', async () => {
  fetchMock.get('/api/tickets?sort=submissionDate', 500);
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Sort by Date')); });
  
  expect(fetchMock.calls('/api/tickets?sort=submissionDate').length).toBe(1);
  expect(screen.getByText('Failed to sort tickets')).toBeInTheDocument();
}, 10000);

test('successfully submits a ticket with required fields filled', async () => {
  fetchMock.post('/api/tickets', { status: 200 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Test Ticket' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Ticket submitted successfully!')).toBeInTheDocument();
}, 10000);

test('shows error when submitting a ticket with missing fields', async () => {
  fetchMock.post('/api/tickets', { status: 400 });
  
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Submit')); });
  
  expect(fetchMock.calls('/api/tickets').length).toBe(1);
  expect(screen.getByText('Title is required')).toBeInTheDocument();
}, 10000);
