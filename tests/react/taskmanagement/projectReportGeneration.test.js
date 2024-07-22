import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ProjectManagementApp from './projectReportGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Generate Project Report - success', async () => {
  fetchMock.get('/api/projects/report', 200);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /generate report/i }));
  });

  expect(fetchMock.calls('/api/projects/report')).toHaveLength(1);
  expect(screen.getByText(/project report/i)).toBeInTheDocument();
}, 10000);

test('Generate Project Report - failure', async () => {
  fetchMock.get('/api/projects/report', 400);

  await act(async () => {
    render(<MemoryRouter><ProjectManagementApp /></MemoryRouter>);
  });

  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /generate report/i }));
  });

  expect(fetchMock.calls('/api/projects/report')).toHaveLength(1);
  expect(screen.getByText(/failed to generate report/i)).toBeInTheDocument();
}, 10000);

