import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LMSComponent from './courseProgressTracking';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('The system correctly tracks course progress.', async () => {
  fetchMock.get('/api/course-progress/101', { progress: 50 });

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Progress: 50%/i)).toBeInTheDocument();
}, 10000);

test('Course progress tracking fails with an error response from the server.', async () => {
  fetchMock.get('/api/course-progress/101', 500);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Track Progress/i)); });

  expect(fetchMock.calls('/api/course-progress/101').length).toEqual(1);
  expect(screen.getByText(/Failed to load progress/i)).toBeInTheDocument();
}, 10000);

