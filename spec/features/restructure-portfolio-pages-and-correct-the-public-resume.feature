@done
@public
@requirements
@ui
@PORT-020
Feature: Restructure portfolio pages and correct the public resume
  """
  Static HTML pages are generated from repository templates and shared resume/profile data. The canonical resume PDF remains untouched; the published derivative corrects the contact header, and an accessible HTML resume provides indexable full-text content. Shared navigation and footer link the homepage to separate Field Notes, Blog, Resume, and How this should be made destinations. Sitemap, canonical metadata, llms.txt, and redirects are generated or maintained with the pages.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. The home page foregrounds leadership, the adaptable first-90-days plan, and three factual case studies; the resume download is a clear CTA.
  #   2. Field Notes, Blog, and the online resume each have distinct, directly addressable pages and accurate canonical metadata.
  #   3. The derived public resume uses brandonhoule@gmail.com, brandonhoule.com, and the supplied LinkedIn address; the canonical source PDF remains unchanged.
  #   4. How this should be made contains the requirements, quality results, manual cases, and complete development record; the home page does not contain the development record.
  #
  # EXAMPLES:
  #   1. A visitor opens the homepage, reads the message that AI handles routine work so people can think, and follows the Download resume CTA.
  #   2. A visitor opens Field Notes and Blog separately, then opens the online resume and sees the corrected contact links.
  #   3. A visitor selects How this should be made and finds requirements, tests, and the commit history together.
  #   4. A visitor uses the footer to open the resume, LinkedIn profile, contact email, and build notes.
  #
  # ========================================
  Background: User Story
    As a a hiring leader visiting the portfolio
    I want to review Brandon's leadership, career evidence, and resume through a calm, easy-to-navigate site
    So that I can decide whether his experience fits the role without sorting through implementation details

  Scenario: Visitor finds the leadership story and resume download
    Given the portfolio homepage is available
    When a hiring leader reviews the leadership profile
    Then the page presents leadership, first-90-days, and case-study sections, the message that AI handles routine work so people can think, and a clear resume download CTA

  Scenario: Visitor navigates separate content and resume pages
    Given the site navigation is available
    When a hiring leader opens Field Notes, Blog, and the online resume
    Then each page has distinct content and the resume shows brandonhoule@gmail.com, brandonhoule.com, and linkedin.com/in/brandon-houle

  Scenario: Visitor finds the complete portfolio development record
    Given requirements, test evidence, manual cases, and commit history are published
    When a visitor opens How this should be made
    Then all portfolio development material is together there and absent from the homepage

  Scenario: Visitor uses the footer to reach contact and profile links
    Given a visitor has reached the end of any portfolio page
    When the visitor scans the site footer
    Then the footer offers useful links to the resume, LinkedIn, email, portfolio sections, and How this should be made
