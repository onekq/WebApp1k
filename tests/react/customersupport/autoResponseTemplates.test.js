import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import AutoResponseTemplates from './autoResponseTemplates';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Successfully configures auto-response templates.', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 200);

  await act(async () => { render(<MemoryRouter><AutoResponseTemplates /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Template saved')).toBeInTheDocument();
}, 10000);

test('Fails to configure auto-response templates.', async () => {
  fetchMock.post('/api/saveAutoResponseTemplate', 500);

  await act(async () => { render(<MemoryRouter><AutoResponseTemplates /></MemoryRouter>); });
  await act(async () => { fireEvent.change(screen.getByTestId('templateContent'), { target: { value: 'Hello' } }); });
  await act(async () => { fireEvent.click(screen.getByText('Save Template')); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Failed to save template')).toBeInTheDocument();
}, 10000);

