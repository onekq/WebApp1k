import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './internalNotes_slaComplianceTracking_ticketVolume';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Adding internal notes to tickets should show success message.', async () => {
  fetchMock.post('/api/add-internal-note', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note added successfully')).toBeInTheDocument();
}, 10000);

test('Adding internal notes to tickets should show error message when failed.', async () => {
  fetchMock.post('/api/add-internal-note', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('internal-note'), { target: { value: 'Internal note content' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('submit-internal-note')); });

  expect(fetchMock.calls('/api/add-internal-note').length).toBe(1);
  expect(screen.getByText('Internal note addition failed')).toBeInTheDocument();
}, 10000);

test('Successfully tracks SLA compliance.', async () => {
  fetchMock.post('/api/report/sla-compliance', {
    status: 200,
    body: { success: true, data: { complianceRate: 0.85 }},
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-03-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-sla-compliance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('SLA Compliance: 85%')).toBeInTheDocument();
}, 10000);

test('Fails to track SLA compliance and shows error message.', async () => {
  fetchMock.post('/api/report/sla-compliance', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-03-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('track-sla-compliance'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);

test('Successfully generates reports on ticket volume.', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 200,
    body: { success: true },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('report-result')).toBeInTheDocument();
}, 10000);

test('Fails to generate reports on ticket volume and shows error message.', async () => {
  fetchMock.post('/api/report/ticket-volume', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-01-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
