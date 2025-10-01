import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './coverLetterAttachments_deleteJobPosts_rejectingApplications';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successful cover letter attachment.', async () => {
  fetchMock.post('/attachCoverLetter', 200);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-letter-input'), { target: { value: 'Cover Letter Text' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('attach-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Cover Letter Attached Successfully')).toBeInTheDocument();
}, 10000);

test('failure cover letter attachment.', async () => {
  fetchMock.post('/attachCoverLetter', 400);

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('cover-letter-input'), { target: { value: 'Cover Letter Text' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('attach-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to Attach Cover Letter')).toBeInTheDocument();
}, 10000);

test('Deleting a job post successfully', async () => {
  fetchMock.delete('/api/job/1', { status: 200 });

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Job deleted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Deleting a job post failure due to not found error', async () => {
  fetchMock.delete('/api/job/1', 404);

  await act(async () => {
    render(<MemoryRouter><JobPostingComponent id="1" /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Delete/i));
  });

  expect(fetchMock.calls('/api/job/1')).toHaveLength(1);
  expect(screen.getByText(/Job not found/i)).toBeInTheDocument();
}, 10000);

test('Employer can successfully reject an application.', async () => {
  fetchMock.post('/api/reject', 200);

  await act(async () => {
    render(
      <MemoryRouter>
        <RejectApplication />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Reject'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Application rejected successfully')).toBeInTheDocument();
}, 10000);

test('Rejecting an application fails due to server error.', async () => {
  fetchMock.post('/api/reject', 500);

  await act(async () => {
    render(
      <MemoryRouter>
        <RejectApplication />
      </MemoryRouter>
    );
  });

  await act(async () => {
    fireEvent.click(screen.getByText('Reject'));
  });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to reject the application')).toBeInTheDocument();
}, 10000);
