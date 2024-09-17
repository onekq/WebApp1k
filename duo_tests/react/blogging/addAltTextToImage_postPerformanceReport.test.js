import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addAltTextToImage_postPerformanceReport';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds alt text to an image', async () => {
  fetchMock.post('/api/alt-text', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/alt text updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add alt text to an image due to server error', async () => {
  fetchMock.post('/api/alt-text', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/failed to update alt text/i)).toBeInTheDocument();
}, 10000);

test('successfully generates post performance report', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 200, body: { performance: 'high' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Performance: high')).toBeInTheDocument();
}, 10000);

test('fails to generate post performance report with an error message', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Error generating report')).toBeInTheDocument();
}, 10000);