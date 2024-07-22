import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LMSComponent from './progressReportGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Progress report can be generated successfully.', async () => {
  fetchMock.get('/api/progress-report', { report: 'Mock Report' });

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Mock Report/i)).toBeInTheDocument();
}, 10000);

test('Progress report generation fails if the server returns an error.', async () => {
  fetchMock.get('/api/progress-report', 500);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Generate Progress Report/i)); });

  expect(fetchMock.calls('/api/progress-report').length).toEqual(1);
  expect(screen.getByText(/Failed to generate progress report/i)).toBeInTheDocument();
}, 10000);

