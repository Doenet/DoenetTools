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
      if ($body.find("[data-test=createNewCourseButton]").length) {
        cy.get('[data-test=createNewCourseButton]').click();
       } else {
        cy.get('[data-test=panelDragHandle]').click({multiple: true});
        cy.get('[data-test=createNewCourseButton]').click();
       }
    })
    
    cy.get(':nth-child(1) > :nth-child(1) > [data-test=navDriveHeader]').should('exist');
    
    cy.get('[data-test=navPanel]').within(() => {
      cy.get('[data-test=navDriveHeader]').should('exist');
    }); 
  });

  it('Clicking on a course card should select it and display its information', function() {
    let courseDriveCardLabel = "";
    const driveCard = cy.get('[data-test=driveCard]').first();
    driveCard.within(() => {
      cy.get('[data-test=driveCardLabel]').invoke('text').then(driveLabel => {
        courseDriveCardLabel = driveLabel;
      })
    });
    driveCard.click();

    // Check for drive label equality
    cy.get('[data-test=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
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
    cy.get('[data-test=createNewCourseButton]').click();
    cy.wait(1000);
    cy.get('[data-test=navPanel]').within(() => {
      cy.get('[data-test=navDriveHeader]').first().click();
    });
  });

  it('Creating a folder at drive level by clicking on the Add Folder button', function() {
    cy.get('[data-test=addFolderButton]').click();

    // Verify item existence and type
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().should('exist');
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=folderIcon]').should('exist');
      })
    });
  })

  it('Creating a folder within another folder', function() {
    cy.get('[data-test=addFolderButton]').click();

    cy.get('[data-test=navPanel]').within(() => {
      // Get second item in navPanel
      const folder = cy.get('[data-test=driveItem]').eq(1);

      // Verify item is a folder
      folder.within(() => {
        cy.get('[data-test=folderIcon]').should('exist');
      });

      // Select folder
      folder.click();
    }); 

    cy.get('[data-test=addFolderButton]').click();

    // Verify item existence and type
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().should('exist');
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=folderIcon]').should('exist');
      })
    });
  })

  it('Deleting a folder by selecting the folder then clicking on the Delete Folder button', function() {
    cy.get('[data-test=addFolderButton]').click();

    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().should('exist');
      const folder = cy.get('[data-test=driveItem]').first();
      folder.invoke('attr', 'data-test', 'folderItem')
      folder.click();
    });

    cy.get('[data-test=deleteFolderButton]').click();

    cy.get('[data-test=folderItem]').should('not.exist');
  })

  it('Single-clicking on a folder should select it and displays information about it in the InfoPanel', function() {
    cy.get('[data-test=addFolderButton]').click();

    // Check for item label equality across Drive and InfoPanel
    let folderLabel = "";
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().click();
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=folderLabel]').invoke('text').then(label => {
          folderLabel = label;
        })
      })
    }); 
    cy.get('[data-test=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(folderLabel.trim()).equal(infoPanelItemLabel.trim());
    })   
  });

  it('Single-clicking on a folder caret should expand/close folder', function() {
    cy.get('[data-test=addFolderButton]').click();

    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=folderToggleOpenIcon]').click();
        cy.get('[data-test=folderToggleOpenIcon]').should('not.exist');
        cy.get('[data-test=folderToggleCloseIcon]').should('exist');

        cy.get('[data-test=folderToggleCloseIcon]').click();
        cy.get('[data-test=folderToggleCloseIcon]').should('not.exist');
        cy.get('[data-test=folderToggleOpenIcon]').should('exist');
      })
    });
  });

  it('Renaming a folder through the input box in the InfoPanel', function() {
    const newFolderLabel = "Test label";

    cy.get('[data-test=addFolderButton]').click();

    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().click();
    });

    cy.get('[data-test=infoPanelItemLabelInput]')
      .clear()
      .type(newFolderLabel)
      .type('{enter}');

    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=folderLabel]').invoke('text').then(folderLabel => {
          expect(folderLabel.trim()).equal(newFolderLabel);
        })
      })
    }); 
    cy.get('[data-test=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(infoPanelItemLabel.trim()).equal(newFolderLabel);
    })   
  });

  it('Creating a new DoenetML at drive level by clicking on the Add DoenetML button', function() {
    cy.get('[data-test=addDoenetMLButton]').click();

    // Verify item existence and type
    cy.get(':nth-child(1) > [data-test=driveItem]').should('exist');
    cy.get(':nth-child(1) > [data-test=driveItem]').within(() => {
      cy.get('[data-test=doenetMLIcon]').should('exist');
    });    
  })

  it('Creating a DoenetML within another folder', function() {
    cy.get('[data-test=addFolderButton]').click();

    cy.get('[data-test=navPanel]').within(() => {
      // Get second item in navPanel
      const folder = cy.get('[data-test=driveItem]').eq(1);

      // Verify item is a folder
      folder.within(() => {
        cy.get('[data-test=folderIcon]').should('exist');
      });

      // Select folder
      folder.click();
    }); 

    cy.get('[data-test=addDoenetMLButton]').click();

    // Verify item existence and type
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().should('exist');
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=doenetMLIcon]').should('exist');
      })
    });
  })

  it('Deleting a DoenetML by selecting the DoenetML then clicking on the Delete DoenetML button', function() {
    cy.get('[data-test=addDoenetMLButton]').click();

    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().should('exist');
      const doenetML = cy.get('[data-test=driveItem]').first();
      doenetML.invoke('attr', 'data-test', 'doenetMLItem')
      doenetML.click();
    });

    cy.get('[data-test=deleteDoenetMLButton]').click();

    cy.get('[data-test=doenetMLItem]').should('not.exist');
  })

  it('Single-clicking on a DoenetML should select it and displays information about it in the InfoPanel', function() {
    cy.get('[data-test=addDoenetMLButton]').click();

    // Check for item label equality across Drive and InfoPanel
    let doenetMLLabel = "";
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().click();
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=doenetMLLabel]').invoke('text').then(label => {
          doenetMLLabel = label;
        })
      })
    }); 
    cy.get('[data-test=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(doenetMLLabel.trim()).equal(infoPanelItemLabel.trim());
    })   
  });

  it('Renaming a doenetML through the input box in the InfoPanel', function() {
    const newDoenetMLLabel = "Test label";

    cy.get('[data-test=addDoenetMLButton]').click();

    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().click();
    });

    cy.get('[data-test=infoPanelItemLabelInput]')
      .clear()
      .type(newDoenetMLLabel)
      .type('{enter}');

    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').first().within(() => {
        cy.get('[data-test=doenetMLLabel]').invoke('text').then(doenetMLLabel => {
          expect(doenetMLLabel.trim()).equal(newDoenetMLLabel);
        })
      })
    }); 
    cy.get('[data-test=infoPanelItemLabel]').invoke('text').then(infoPanelItemLabel => {
      expect(infoPanelItemLabel.trim()).equal(newDoenetMLLabel);
    })   
  });

  it('Testing DND', function() {
    cy.get('[data-test=addFolderButton]').click();
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').invoke('attr', 'data-test', 'folderItem')
    });

    cy.get('[data-test=addDoenetMLButton]').click();
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').invoke('attr', 'data-test', 'doenetMLItem')
    });

    cy.get('[data-test=addDoenetMLButton]').click();
    cy.get('[data-test=mainPanel]').within(() => {
      cy.get('[data-test=driveItem]').invoke('attr', 'data-test', 'doenetMLItem2')
    });
    
    cy.get('[data-test=folderItem]').dragTo("[data-test=doenetMLItem2]", { delay: 50, steps: 30, smooth: true });
  });
});
