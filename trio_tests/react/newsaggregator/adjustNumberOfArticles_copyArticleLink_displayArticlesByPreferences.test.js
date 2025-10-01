import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './adjustNumberOfArticles_copyArticleLink_displayArticlesByPreferences';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});


test('adjusts the number of articles shown successfully', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 200, body: Array.from({ length: 10 }, (_, i) => ({ id: i, title: `Article ${i}` })) });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  Array.from({ length: 10 }, (_, i) => `Article ${i}`).forEach(title => expect(screen.getByText(title)).toBeInTheDocument());
}, 10000);

test('fails to adjust the number of articles shown', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust the number of articles')).toBeInTheDocument();
}, 10000);

test('copies article link to clipboard successfully', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Link copied')).toBeInTheDocument();
}, 10000);

test('fails to copy article link to clipboard with error message', async () => {
  navigator.clipboard.writeText = jest.fn().mockImplementation(() => { throw new Error('Copy failed'); });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Failed to copy link')).toBeInTheDocument();
}, 10000);

test('displays articles based on user preferences successfully', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 200, body: [{ id: 5, title: 'Preferred News' }] });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Preferred News')).toBeInTheDocument();
}, 10000);

test('fails to display articles based on user preferences', async () => {
  fetchMock.get('/api/articles?preferences=true', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByTestId('display-preferences-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to load preference-based articles')).toBeInTheDocument();
}, 10000);
