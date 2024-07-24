import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CourseExpiryHandling from './courseExpiryHandling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully handles course expiry and re-enrollment', async () => {
  fetchMock.post('/courses/expire', { status: 200 });

  await act(async () => { render(<MemoryRouter><CourseExpiryHandling /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment successful')).toBeInTheDocument();
}, 10000);

test('Fails to handle course expiry and re-enrollment', async () => {
  fetchMock.post('/courses/expire', { status: 500, body: 'Error' });

  await act(async () => { render(<MemoryRouter><CourseExpiryHandling /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Re-enroll')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Re-enrollment failed')).toBeInTheDocument();
}, 10000);

