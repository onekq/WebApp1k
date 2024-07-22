import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import FlagArticle from './flagInappropriateArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Flag inappropriate article successfully.', async () => {
  fetchMock.post('/api/flag-article', { success: true });

  await act(async () => { render(<MemoryRouter><FlagArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Article flagged successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to flag inappropriate article and display error.', async () => {
  fetchMock.post('/api/flag-article', 500);

  await act(async () => { render(<MemoryRouter><FlagArticle /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Flag Article")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error flagging article.")).toBeInTheDocument();
}, 10000);

