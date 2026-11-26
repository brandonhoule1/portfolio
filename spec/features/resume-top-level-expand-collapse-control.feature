@done
@requirements
@ui
@ui
@requirements
@PORT-036
Feature: Resume top-level expand/collapse control
  """
  Controls precede the identity heading in document order; one interaction opens/closes every disclosure.
  """

  # ========================================
  # EXAMPLE MAPPING CONTEXT
  # ========================================
  #
  # BUSINESS RULES:
  #   1. The expand and collapse controls appear at the top of the resume content, before the identity header and all sections.
  #   2. Expand all opens every expandable detail section, including later sections below the initial viewport; Collapse all closes them all.
  #
  # EXAMPLES:
  #   1. At page load, all detail disclosures are collapsed. Selecting Expand all opens every disclosure across roles and skills; selecting Collapse all closes every disclosure.
  #
  # ========================================
  Background: User Story
    As a resume reader
    I want to expand or collapse all resume details from a control at the top
    So that see the full experience without scrolling to find the control

  Scenario: Reader finds the controls before the resume content
    Given the online resume is open
    Then the Expand all and Collapse all controls appear before the resume heading
    And the detail sections start collapsed

  Scenario: Reader expands and collapses all resume details
    Given the online resume is open
    When the reader selects Expand all
    Then every role and skills detail section is open
    And the page confirms that the details are expanded
    When the reader selects Collapse all
    Then every role and skills detail section is closed
    And the page confirms that the details are collapsed
