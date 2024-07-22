import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ShareViaEmailComponent from './shareArticleViaEmail';

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

