import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import SLAComplianceTracking from './slaComplianceTracking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully tracks SLA compliance.', async () => {
  fetchMock.post('/api/report/sla-compliance', {
    status: 200,
    body: { success: true, data: { complianceRate: 0.85 }},
  });

  await act(async () => {
    render(<MemoryRouter><SLAComplianceTracking /></MemoryRouter>);
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
    render(<MemoryRouter><SLAComplianceTracking /></MemoryRouter>);
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

