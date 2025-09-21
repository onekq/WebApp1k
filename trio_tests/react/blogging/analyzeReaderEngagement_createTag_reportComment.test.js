import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './analyzeReaderEngagement_createTag_reportComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('successfully analyzes reader engagement', async () => {
  fetchMock.get('/api/analyzeReaderEngagement?postId=1', { status: 200, body: { engagementScore: 85 } });

  await act(async () => { render(<MemoryRouter><AnalyzeReaderEngagement postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Engagement')); });

  expect(fetchMock.calls('/api/analyzeReaderEngagement')).toHaveLength(1);
  expect(screen.getByText('Engagement Score: 85')).toBeInTheDocument();
}, 10000);

test('fails to analyze reader engagement with an error message', async () => {
  fetchMock.get('/api/analyzeReaderEngagement?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><AnalyzeReaderEngagement postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Analyze Engagement')); });

  expect(fetchMock.calls('/api/analyzeReaderEngagement')).toHaveLength(1);
  expect(screen.getByText('Error analyzing engagement')).toBeInTheDocument();
}, 10000);

test('User can create a new tag successfully', async () => {
  fetchMock.post('/tags', {
    status: 201,
    body: { id: 1, name: 'New Tag' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'New Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Tag')); });

  expect(fetchMock.calls('/tags').length).toBe(1);
  expect(screen.getByText('Tag created successfully')).toBeInTheDocument();
}, 10000);

test('User gets an error message when creating a new tag fails', async () => {
  fetchMock.post('/tags', {
    status: 500,
    body: { error: 'Unable to create tag' }
  });

  await act(async () => { render(<MemoryRouter><MyComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText('Tag Name'), { target: { value: 'New Tag' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Create Tag')); });

  expect(fetchMock.calls('/tags').length).toBe(1);
  expect(screen.getByText('Error: Unable to create tag')).toBeInTheDocument();
}, 10000);

test('successfully reports a comment', async () => {
  fetchMock.post('/api/comments/report/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Comment reported successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to report a comment', async () => {
  fetchMock.post('/api/comments/report/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Report/i)); });

  expect(fetchMock.calls('/api/comments/report/1').length).toBe(1);
  expect(screen.getByText(/Failed to report comment/i)).toBeInTheDocument();
}, 10000);
