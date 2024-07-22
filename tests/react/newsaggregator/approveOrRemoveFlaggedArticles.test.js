import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ModerateArticles from './approveOrRemoveFlaggedArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Approve or remove flagged articles successfully.', async () => {
  fetchMock.post('/api/moderate-articles', { success: true });

  await act(async () => { render(<MemoryRouter><ModerateArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles moderated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to approve or remove flagged articles and display error.', async () => {
  fetchMock.post('/api/moderate-articles', 500);

  await act(async () => { render(<MemoryRouter><ModerateArticles /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error moderating articles.")).toBeInTheDocument();
}, 10000);