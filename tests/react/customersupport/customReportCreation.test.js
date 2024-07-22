import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CustomReportCreation from './customReportCreation';

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
    render(<MemoryRouter><CustomReportCreation /></MemoryRouter>);
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
    render(<MemoryRouter><CustomReportCreation /></MemoryRouter>);
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

