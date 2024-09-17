import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './interviewNotifications_resubmitApplication';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Candidate is successfully notified about the interview.', async () => {
  fetchMock.post('/api/notify', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <InterviewNotification />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Notify'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Candidate notified successfully')).toBeInTheDocument();
}, 10000);

test('Notifying the candidate about the interview fails due to server error.', async () => {
  fetchMock.post('/api/notify', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <InterviewNotification />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Notify'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to notify the candidate')).toBeInTheDocument();
}, 10000);

test('successful application resubmission.', async () => {
  fetchMock.post('/resubmitApplication', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application Resubmitted Successfully')).toBeInTheDocument();
}, 10000);

test('failure application resubmission.', async () => {
  fetchMock.post('/resubmitApplication', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('job-id-input'), { target: { value: '123' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('resubmit-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Resubmit Application')).toBeInTheDocument();
}, 10000);