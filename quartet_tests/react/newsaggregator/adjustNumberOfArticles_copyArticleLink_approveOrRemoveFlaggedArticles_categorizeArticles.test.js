import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import App from './adjustNumberOfArticles_copyArticleLink_approveOrRemoveFlaggedArticles_categorizeArticles';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('adjusts the number of articles shown successfully (from adjustNumberOfArticles_copyArticleLink)', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 200, body: Array.from({ length: 10 }, (_, i) => ({ id: i, title: `Article ${i}` })) });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  Array.from({ length: 10 }, (_, i) => `Article ${i}`).forEach(title => expect(screen.getByText(title)).toBeInTheDocument());
}, 10000);

test('fails to adjust the number of articles shown (from adjustNumberOfArticles_copyArticleLink)', async () => {
  fetchMock.get('/api/articles?limit=10', { status: 500 });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('articles-limit-input'), { target: { value: '10' } }); });
  await act(async () => { fireEvent.click(screen.getByTestId('adjust-articles-button')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to adjust the number of articles')).toBeInTheDocument();
}, 10000);

test('copies article link to clipboard successfully (from adjustNumberOfArticles_copyArticleLink)', async () => {
  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Link copied')).toBeInTheDocument();
}, 10000);

test('fails to copy article link to clipboard with error message (from adjustNumberOfArticles_copyArticleLink)', async () => {
  navigator.clipboard.writeText = jest.fn().mockImplementation(() => { throw new Error('Copy failed'); });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText('Copy Link')); });

  expect(navigator.clipboard.writeText).toBeCalledWith('http://example.com/article');
  expect(screen.getByText('Failed to copy link')).toBeInTheDocument();
}, 10000);

test('Approve or remove flagged articles successfully. (from approveOrRemoveFlaggedArticles_categorizeArticles)', async () => {
  fetchMock.post('/api/moderate-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles moderated successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to approve or remove flagged articles and display error. (from approveOrRemoveFlaggedArticles_categorizeArticles)', async () => {
  fetchMock.post('/api/moderate-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Moderate Articles")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error moderating articles.")).toBeInTheDocument();
}, 10000);

test('Categorize articles based on predefined categories successfully. (from approveOrRemoveFlaggedArticles_categorizeArticles)', async () => {
  fetchMock.post('/api/categorize-articles', { success: true });

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Articles categorized successfully.")).toBeInTheDocument();
}, 10000);

test('Fail to categorize articles and display error. (from approveOrRemoveFlaggedArticles_categorizeArticles)', async () => {
  fetchMock.post('/api/categorize-articles', 500);

  await act(async () => { render(<MemoryRouter><App /></MemoryRouter>); });
  await act(async () => { fireEvent.click(screen.getByText("Categorize")); });

  expect(fetchMock.calls().length).toBe(1);
  expect(screen.getByText("Error categorizing articles.")).toBeInTheDocument();
}, 10000);

