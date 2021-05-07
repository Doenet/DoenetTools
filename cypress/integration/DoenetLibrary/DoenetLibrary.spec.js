import { expect } from "chai";

describe("Course creation in Library", function () {
  beforeEach(() => {
    cy.visit('/signin');
    cy.visit('/library');
    cy.wait(500);
  });

  it('Creating a new course by clicking the create a new course button', { retries: 3 }, function() {
    cy.wait(2000);
    // Handle side panels sometimes not opened by default
    cy.get("body").then(($body) => {
      if ($body.find("[data-cy=createNewCourseButton]").length) {
        cy.get('[data-cy=createNewCourseButton]').click();
       } else {
        cy.get('[data-cy=panelDragHandle]').click({multiple: true});
        cy.get('[data-cy=createNewCourseButton]').click();
       }
    })
    
    cy.get(':nth-child(1) > :nth-child(1) > [data-cy=navDriveHeader]').should('exist');
    
    cy.get('[data-cy=navPanel]').within(() => {
      cy.get('[data-cy=navDriveHeader]').should('exist');
    }); 
  });

  it('Clicking on a course card should select it and display its information', function() {
    let courseDriveCardLabel = "";
    const driveCard = cy.get('[data-cy=driveCard]').first();
    driveCard.within(() => {
      cy.get('[data-cy=driveCardLabel]').invoke('text').then(driveLabel => {
        courseDriveCardLabel = driveLabel;
      })
    });
    driveCard.click();

    // Check for drive label equality
    cy.get('[data-cy=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(courseDriveCardLabel.trim()).equal(infoPanelItemLabel.trim());
    })   
  });
});

describe("Library items creation and deletion", function () {
  beforeEach(() => {
    cy.visit('/signin');
    cy.wait(500);
    cy.visit('/library');
    cy.wait(500);

    // Create a new course and select it
    cy.get('[data-cy=createNewCourseButton]').click();
    cy.wait(1000);
    cy.get('[data-cy=navPanel]').within(() => {
      cy.get('[data-cy=navDriveHeader]').first().click();
    });
  });

  it('Creating a folder at drive level by clicking on the Add Folder button', function() {
    cy.get('[data-cy=addFolderButton]').click();

    // Verify item existence and type
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().should('exist');
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=folderIcon]').should('exist');
      })
    });
  })

  it('Creating a folder within another folder', function() {
    cy.get('[data-cy=addFolderButton]').click();

    cy.get('[data-cy=navPanel]').within(() => {
      // Get second item in navPanel
      const folder = cy.get('[data-cy=driveItem]').eq(1);

      // Verify item is a folder
      folder.within(() => {
        cy.get('[data-cy=folderIcon]').should('exist');
      });

      // Select folder
      folder.click();
    }); 

    cy.get('[data-cy=addFolderButton]').click();

    // Verify item existence and type
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().should('exist');
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=folderIcon]').should('exist');
      })
    });
  })

  it('Deleting a folder by selecting the folder then clicking on the Delete Folder button', function() {
    cy.get('[data-cy=addFolderButton]').click();

    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().should('exist');
      const folder = cy.get('[data-cy=driveItem]').first();
      folder.invoke('attr', 'data-cy', 'folderItem')
      folder.click();
    });

    cy.get('[data-cy=deleteFolderButton]').click();

    cy.get('[data-cy=folderItem]').should('not.exist');
  })

  it('Single-clicking on a folder should select it and displays information about it in the InfoPanel', function() {
    cy.get('[data-cy=addFolderButton]').click();

    // Check for item label equality across Drive and InfoPanel
    let folderLabel = "";
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().click();
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=folderLabel]').invoke('text').then(label => {
          folderLabel = label;
        })
      })
    }); 
    cy.get('[data-cy=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(folderLabel.trim()).equal(infoPanelItemLabel.trim());
    })   
  });

  it('Single-clicking on a folder caret should expand/close folder', function() {
    cy.get('[data-cy=addFolderButton]').click();

    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=folderToggleOpenIcon]').click();
        cy.get('[data-cy=folderToggleOpenIcon]').should('not.exist');
        cy.get('[data-cy=folderToggleCloseIcon]').should('exist');

        cy.get('[data-cy=folderToggleCloseIcon]').click();
        cy.get('[data-cy=folderToggleCloseIcon]').should('not.exist');
        cy.get('[data-cy=folderToggleOpenIcon]').should('exist');
      })
    });
  });

  it('Renaming a folder through the input box in the InfoPanel', function() {
    const newFolderLabel = "Test label";

    cy.get('[data-cy=addFolderButton]').click();

    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().click();
    });

    cy.get('[data-cy=infoPanelItemLabelInput]')
      .clear()
      .type(newFolderLabel)
      .type('{enter}');

    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=folderLabel]').invoke('text').then(folderLabel => {
          expect(folderLabel.trim()).equal(newFolderLabel);
        })
      })
    }); 
    cy.get('[data-cy=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(infoPanelItemLabel.trim()).equal(newFolderLabel);
    })   
  });

  it('Creating a new DoenetML at drive level by clicking on the Add DoenetML button', function() {
    cy.get('[data-cy=addDoenetMLButton]').click();

    // Verify item existence and type
    cy.get(':nth-child(1) > [data-cy=driveItem]').should('exist');
    cy.get(':nth-child(1) > [data-cy=driveItem]').within(() => {
      cy.get('[data-cy=doenetMLIcon]').should('exist');
    });    
  })

  it('Creating a DoenetML within another folder', function() {
    cy.get('[data-cy=addFolderButton]').click();

    cy.get('[data-cy=navPanel]').within(() => {
      // Get second item in navPanel
      const folder = cy.get('[data-cy=driveItem]').eq(1);

      // Verify item is a folder
      folder.within(() => {
        cy.get('[data-cy=folderIcon]').should('exist');
      });

      // Select folder
      folder.click();
    }); 

    cy.get('[data-cy=addDoenetMLButton]').click();

    // Verify item existence and type
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().should('exist');
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=doenetMLIcon]').should('exist');
      })
    });
  })

  it('Deleting a DoenetML by selecting the DoenetML then clicking on the Delete DoenetML button', function() {
    cy.get('[data-cy=addDoenetMLButton]').click();

    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().should('exist');
      const doenetML = cy.get('[data-cy=driveItem]').first();
      doenetML.invoke('attr', 'data-cy', 'doenetMLItem')
      doenetML.click();
    });

    cy.get('[data-cy=deleteDoenetMLButton]').click();

    cy.get('[data-cy=doenetMLItem]').should('not.exist');
  })

  it('Single-clicking on a DoenetML should select it and displays information about it in the InfoPanel', function() {
    cy.get('[data-cy=addDoenetMLButton]').click();

    // Check for item label equality across Drive and InfoPanel
    let doenetMLLabel = "";
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().click();
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=doenetMLLabel]').invoke('text').then(label => {
          doenetMLLabel = label;
        })
      })
    }); 
    cy.get('[data-cy=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(doenetMLLabel.trim()).equal(infoPanelItemLabel.trim());
    })   
  });

  it('Renaming a doenetML through the input box in the InfoPanel', function() {
    const newDoenetMLLabel = "Test label";

    cy.get('[data-cy=addDoenetMLButton]').click();

    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().click();
    });

    cy.get('[data-cy=infoPanelItemLabelInput]')
      .clear()
      .type(newDoenetMLLabel)
      .type('{enter}');

    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').first().within(() => {
        cy.get('[data-cy=doenetMLLabel]').invoke('text').then(doenetMLLabel => {
          expect(doenetMLLabel.trim()).equal(newDoenetMLLabel);
        })
      })
    }); 
    cy.get('[data-cy=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(infoPanelItemLabel.trim()).equal(newDoenetMLLabel);
    })   
  });

  it('Testing DND', function() {
    cy.get('[data-cy=addFolderButton]').click();
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').invoke('attr', 'data-cy', 'folderItem')
    });

    cy.get('[data-cy=addDoenetMLButton]').click();
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').invoke('attr', 'data-cy', 'doenetMLItem')
    });

    cy.get('[data-cy=addDoenetMLButton]').click();
    cy.get('[data-cy=mainPanel]').within(() => {
      cy.get('[data-cy=driveItem]').invoke('attr', 'data-cy', 'doenetMLItem2')
    });
    
    cy.get('[data-cy=folderItem]').dragTo("[data-cy=doenetMLItem2]", { delay: 50, steps: 30, smooth: true });
  });
});
