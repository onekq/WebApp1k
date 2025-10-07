import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './addAltTextToImage_postPerformanceReport_addMetaKeywords_dislikeComment';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('successfully adds alt text to an image (from addAltTextToImage_postPerformanceReport)', async () => {
  fetchMock.post('/api/alt-text', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/alt text updated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to add alt text to an image due to server error (from addAltTextToImage_postPerformanceReport)', async () => {
  fetchMock.post('/api/alt-text', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByLabelText(/alt text/i), { target: { value: 'New Alt Text' } }); });
  await act(async () => { fireEvent.click(screen.getByText(/save/i)); });

  expect(fetchMock.calls('/api/alt-text').length).toBe(1);
  expect(screen.getByText(/failed to update alt text/i)).toBeInTheDocument();
}, 10000);

test('successfully generates post performance report (from addAltTextToImage_postPerformanceReport)', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 200, body: { performance: 'high' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Performance: high')).toBeInTheDocument();
}, 10000);

test('fails to generate post performance report with an error message (from addAltTextToImage_postPerformanceReport)', async () => {
  fetchMock.get('/api/generatePostPerformanceReport?postId=1', { status: 500, body: { message: 'Server Error' } });

  await act(async () => { render(<MemoryRouter><App postId="1" /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Generate Report')); });

  expect(fetchMock.calls('/api/generatePostPerformanceReport')).toHaveLength(1);
  expect(screen.getByText('Error generating report')).toBeInTheDocument();
}, 10000);

test('successfully generates and adds meta keywords to a post (from addMetaKeywords_dislikeComment)', async () => {
  fetchMock.post('/api/meta-keywords', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/meta keywords generated successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to generate and add meta keywords to a post due to server error (from addMetaKeywords_dislikeComment)', async () => {
  fetchMock.post('/api/meta-keywords', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/generate meta keywords/i)); });

  expect(fetchMock.calls('/api/meta-keywords').length).toBe(1);
  expect(screen.getByText(/failed to generate meta keywords/i)).toBeInTheDocument();
}, 10000);

test('successfully dislikes a comment (from addMetaKeywords_dislikeComment)', async () => {
  fetchMock.post('/api/comments/dislike/1', 200);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Dislike/i)); });

  expect(fetchMock.calls('/api/comments/dislike/1').length).toBe(1);
  expect(screen.getByText(/Comment disliked successfully/i)).toBeInTheDocument();
}, 10000);

test('fails to dislike a comment (from addMetaKeywords_dislikeComment)', async () => {
  fetchMock.post('/api/comments/dislike/1', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText(/Dislike/i)); });

  expect(fetchMock.calls('/api/comments/dislike/1').length).toBe(1);
  expect(screen.getByText(/Failed to dislike comment/i)).toBeInTheDocument();
}, 10000);

