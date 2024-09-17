import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './postNewJob_uploadResumes';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Posting a new job successfully', async () => {
  fetchMock.post('/api/job', { status: 201 });

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);  
  });
  await act(async () => {
    fireEvent.change(screen.getByLabelText(/Job Title/i), { target: { value: 'Software Engineer' } });
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Job posted successfully!/i)).toBeInTheDocument();
}, 10000);

test('Posting a new job failure due to missing fields', async () => {
  fetchMock.post('/api/job', 400);

  await act(async () => {
    render(<MemoryRouter><App /></MemoryRouter>);
  });
  await act(async () => {
    fireEvent.click(screen.getByText(/Submit/i));
  });

  expect(fetchMock.calls('/api/job')).toHaveLength(1);
  expect(screen.getByText(/Please fill out all required fields/i)).toBeInTheDocument();
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