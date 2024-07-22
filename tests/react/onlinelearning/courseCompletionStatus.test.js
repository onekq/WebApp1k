import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import LMSComponent from './courseCompletionStatus';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Course completion status is updated successfully.', async () => {
  fetchMock.post('/api/course-complete/101', 200);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Course completed successfully/i)).toBeInTheDocument();
}, 10000);

test('Course completion status update fails if the server returns an error.', async () => {
  fetchMock.post('/api/course-complete/101', 400);

  await act(async () => { render(<MemoryRouter><LMSComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Complete Course/i)); });

  expect(fetchMock.calls('/api/course-complete/101').length).toEqual(1);
  expect(screen.getByText(/Failed to complete the course/i)).toBeInTheDocument();
}, 10000);

