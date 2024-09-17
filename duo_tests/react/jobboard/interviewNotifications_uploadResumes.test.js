import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './interviewNotifications_uploadResumes';

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

test('successful resume upload.', async () => {
  fetchMock.post('/uploadResume', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Resume Uploaded Successfully')).toBeInTheDocument();
}, 10000);

test('failure resume upload.', async () => {
  fetchMock.post('/uploadResume', 400);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('resume-upload-input'), { target: { files: ['resume.pdf'] } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('upload-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Upload Resume')).toBeInTheDocument();
}, 10000);