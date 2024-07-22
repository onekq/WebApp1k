import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import CopyArticleLinkComponent from './copyArticleLink';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('copies article link to clipboard successfully', async () => {
  await act(async () => { render(<MemoryRouter><CopyArticleLinkComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Link copied')).toBeInTheDocument();
}, 10000);

test('fails to copy article link to clipboard with error message', async () => {
  navigator.clipboard.writeText = jest.fn().mockImplementation(() => { throw new Error('Copy failed'); });

  await act(async () => { render(<MemoryRouter><CopyArticleLinkComponent /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Failed to copy link')).toBeInTheDocument();
}, 10000);

