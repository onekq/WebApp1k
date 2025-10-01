import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './shareArticleViaEmail_sortByDateNewestFirst_trackArticleViewCount';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('shares an article via email successfully', async () => {
  fetchMock.post('/share/email', 200);

  await act(async () => { render(<MemoryRouter><ShareViaEmailComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Shared via email')).toBeInTheDocument();
}, 10000);

test('fails to share an article via email with error message', async () => {
  fetchMock.post('/share/email', 500);

  await act(async () => { render(<MemoryRouter><ShareViaEmailComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Email')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to share via email')).toBeInTheDocument();
}, 10000);

test('Sorts articles by date (newest first) successfully', async () => {
  fetchMock.get('/api/articles?sort=newest', { status: 200, body: [{ id: 1, date: '2023-10-01' }] });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="newest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('2023-10-01')).toBeInTheDocument();
}, 10000);

test('Fails to sort articles by date (newest first)', async () => {
  fetchMock.get('/api/articles?sort=newest', { status: 500 });

  await act(async () => { render(<MemoryRouter><HomePage sortBy="newest" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to sort articles by date')).toBeInTheDocument();
}, 10000);

test('Tracks article view count successfully.', async () => {
  fetchMock.post('/api/trackView', { status: 200 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('View Count Tracked')).toBeInTheDocument();
}, 10000);

test('Fails to track article view count.', async () => {
  fetchMock.post('/api/trackView', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('View Article')); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText('Failed to track view count')).toBeInTheDocument();
}, 10000);
