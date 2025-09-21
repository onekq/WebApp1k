import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './autoResponseSending_autoResponseTemplates_ticketResolutionRate';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Successfully sends auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 200);

  await act(async () => { render(<MemoryRouter><AutoResponseSending /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Auto-response sent')).toBeInTheDocument();
}, 10000);

test('Fails to send auto-responses based on ticket content.', async () => {
  fetchMock.post('/api/sendAutoResponse', 500);

  await act(async () => { render(<MemoryRouter><AutoResponseSending /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('ticketContent'), { target: { value: 'Issue' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Send Auto-Response')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to send auto-response')).toBeInTheDocument();
}, 10000);

test('Successfully configures auto-response templates.', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 200);

  await act(async () => { render(<MemoryRouter><AutoResponseTemplates /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Template saved')).toBeInTheDocument();
}, 10000);

test('Fails to configure auto-response templates.', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 500);

  await act(async () => { render(<MemoryRouter><AutoResponseTemplates /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save template')).toBeInTheDocument();
}, 10000);

test('Successfully reports on ticket resolution rates.', async () => {
  fetchMock.post('/api/report/resolution-rate', {
    status: 200,
    body: { success: true, data: { resolutionRate: 0.75 }},
  });

  await act(async () => {
    render(<MemoryRouter><ResolutionRateReporting /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-02-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-resolution-rate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resolution Rate: 75%')).toBeInTheDocument();
}, 10000);

test('Fails to report on ticket resolution rates and shows error message.', async () => {
  fetchMock.post('/api/report/resolution-rate', {
    status: 500,
    body: { error: 'Server Error' },
  });

  await act(async () => {
    render(<MemoryRouter><ResolutionRateReporting /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.change(screen.getByTestId('date-picker'), { target: { value: '2022-02-01' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByTestId('generate-resolution-rate-report'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByTestId('error-message')).toBeInTheDocument();
}, 10000);
