"use client";

import React from "react";
import { NextIntlClientProvider, AbstractIntlMessages } from "next-intl";

interface I18nProviderProps {
  locale: string;
  messages: AbstractIntlMessages;
  children: React.ReactNode;
}

export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
