import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom';
import ContentTranslation from './contentTranslationHandling';

afterEach(() => {
  fetchMock.reset();
  fetchMock.restore();
});

test('Content Translation Handling success: should display translated content.', async () => {
  fetchMock.get('/api/courses/1?lang=es', { id: 1, title: 'Curso de Reacto', details: 'Informaci�n detallada' });

  await act(async () => { render(<MemoryRouter><ContentTranslation courseId={1} language="es" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Curso de Reacto')).toBeInTheDocument();
}, 10000);

test('Content Translation Handling failure: should display an error message on translation failure.', async () => {
  fetchMock.get('/api/courses/1?lang=es', 404);

  await act(async () => { render(<MemoryRouter><ContentTranslation courseId={1} language="es" /></MemoryRouter>); });

  expect(fetchMock.calls()).toHaveLength(1);
  expect(screen.getByText('Content cannot be translated.')).toBeInTheDocument();
}, 10000);

