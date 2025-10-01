import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './enrollInCourse_prerequisiteCheck_waitlistManagement';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('Users can successfully enroll in a course.', async () => {
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Users cannot enroll in a course if the server returns an error.', async () => {
  fetchMock.post('/api/enroll', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/Course ID/i), { target: { value: '101' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Failed to enroll/i)).toBeInTheDocument();
}, 10000);

test('Enrollment is allowed after prerequisites are met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: true });
  fetchMock.post('/api/enroll', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(1);
  expect(screen.getByText(/Enrolled successfully/i)).toBeInTheDocument();
}, 10000);

test('Enrollment is blocked if prerequisites are not met.', async () => {
  fetchMock.get('/api/check-prerequisites/101', { prerequisitesMet: false });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Check Prerequisites/i)); });
  await act(async () => { fireEvent.click(screen.getByText(/Enroll/i)); });

  expect(fetchMock.calls('/api/enroll').length).toEqual(0);
  expect(screen.getByText(/Cannot enroll, prerequisites not met/i)).toBeInTheDocument();
}, 10000);

test('Users can be successfully added to the waitlist.', async () => {
  fetchMock.post('/api/waitlist', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Added to waitlist successfully/i)).toBeInTheDocument();
}, 10000);

test('Adding users to the waitlist fails with an error.', async () => {
  fetchMock.post('/api/waitlist', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Join Waitlist/i)); });

  expect(fetchMock.calls('/api/waitlist').length).toEqual(1);
  expect(screen.getByText(/Failed to join waitlist/i)).toBeInTheDocument();
}, 10000);
