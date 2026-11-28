@done
@public
@requirements
@ui
@PORT-020
Feature: Restructure portfolio pages and keep contact details private
  """
  The static portfolio presents a concise homepage, dedicated leadership, first-90-days, case-studies, blog, resume, contact, and development-record pages. Field Notes is absent. Public metadata and the downloadable resume contain no personal email address or phone number.
  """

  Background: User Story
    As a hiring leader visiting the portfolio
    I want to review Brandon's leadership, career evidence, and resume through a calm, easy-to-navigate site
    So that I can decide whether his experience fits the role without sorting through every detail at once

  Scenario: Visitor finds the leadership message and resume
    Given the portfolio homepage is available
    When a hiring leader reviews the opening section
    Then the page presents the people-first AI message, LinkedIn portrait, and resume download CTA
    And the detailed first-90-days plan and case studies are on separate pages

  Scenario: Visitor opens the separate portfolio pages
    Given the site navigation is available
    When a visitor opens Leadership, First 90 days, Case studies, Blog, and Resume
    Then each destination has its own content and canonical URL
    And the blog index clearly labels the current article as a draft for review, not as published
    And Field Notes is not published

  Scenario: Visitor contacts Brandon without a published address
    Given the contact page and online resume are available
    When a visitor wants to get in touch
    Then the site offers the contact form and LinkedIn
    And the public resume PDF and website do not expose an email address or phone number

  Scenario: Visitor finds the development record
    Given requirements, test evidence, manual cases, and commit history are published
    When a visitor opens the development record
    Then the portfolio build material is together there and not expanded on the homepage

  Scenario: Valid contact message is sent through Gmail API
    Given the Google OAuth client, refresh token, and private recipient are configured as encrypted Cloudflare values
    When a visitor submits a valid contact message
    Then the site sends the message through Gmail API and shows a success confirmation
    And the visitor's address is the reply address while OAuth credentials and the recipient remain server-side

  Scenario: Contact delivery fails safely when Google configuration is absent
    Given one or more Google OAuth or recipient values are missing
    When a visitor submits a valid contact message
    Then the site shows a generic delivery configuration message and does not claim the message was sent
