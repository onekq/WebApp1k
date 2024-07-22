import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import UnlikeArticleComponent from './unlikeArticle';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('unlikes an article successfully', async () => {
  fetchMock.post('/unlike', 200);

  await act(async () => { render(<MemoryRouter><UnlikeArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Unliked')).toBeInTheDocument();
}, 10000);

test('fails to unlike an article with error message', async () => {
  fetchMock.post('/unlike', 500);

  await act(async () => { render(<MemoryRouter><UnlikeArticleComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Unlike')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to unlike')).toBeInTheDocument();
}, 10000);

