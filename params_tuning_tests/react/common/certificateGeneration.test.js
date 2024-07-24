import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CourseCompletion from './certificateGeneration';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Certificate is generated upon course completion.', async () => {
  fetchMock.post('/api/course/complete', { certificateUrl: '/certificates/1' });

  await act(async () => { render(<MemoryRouter><CourseCompletion /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/download certificate/i)).toBeInTheDocument();
}, 10000);

test('Error message is shown when certificate generation fails.', async () => {
  fetchMock.post('/api/course/complete', 500);

  await act(async () => { render(<MemoryRouter><CourseCompletion /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/complete course/i)); });

  expect(fetchMock.calls().length).toEqual(1);
  expect(screen.getByText(/failed to generate certificate/i)).toBeInTheDocument();
}, 10000);

