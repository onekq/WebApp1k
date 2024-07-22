import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import GeneratePostPerformanceReport from './postPerformanceReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully generates post performance report', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 200, body: { performance: 'high' } });

  await act(async () => { render(<MemoryRouter><GeneratePostPerformanceReport postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Performance: high')).toBeInTheDocument();
}, 10000);

test('fails to generate post performance report with an error message', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><GeneratePostPerformanceReport postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Error generating report')).toBeInTheDocument();
}, 10000);

