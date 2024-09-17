import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './certificateGeneration_unenrollFromCourse';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Certificate is generated upon course completion.', async () => {
  fetchMock.post('/api/course/complete', { certificateUrl: '/certificates/1' });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/download certificate/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate generation fails.', async () => {
  fetchMock.post('/api/course/complete', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to generate certificate/i)).toBeInTheDocument();
}, 10000);

test('Users can successfully unenroll from a course.', async () => {
  fetchMock.delete('/api/unenroll/101', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Unenrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot unenroll from a course if the server returns an error.', async () => {
  fetchMock.delete('/api/unenroll/101', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Unenroll from Course/i)); });

  expect(fetchMock.calls('/api/unenroll/101').length).toEqual(1);
  expect(screen.getByText(/Failed to unenroll/i)).toBeInTheDocument();
}, 10000);