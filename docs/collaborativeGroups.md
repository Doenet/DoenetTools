 # Specification for how DoenetML collaborate tags will function
 
        <meta>
          <collaborateGroups>
            <possibleNumbersOfGroups>
              3,7
            </possibleNumbersOfGroups>
            <spreadOutControl>
            <componentTypes>slider,mathinput</componentTypes> <!--default to "all"-->
            </spreadOutControl>

          </collaborateGroups>
        </meta>


        <slider name="A" restrictToCollaborateGroups="3:1, 7:(1,2)"/>
        <slider name="B" restrictToCollaborateGroups="3:2, 7:3" />
        <slider name="C" restrictToCollaborateGroups="7:2" />
        <slider name="D" restrictToCollaborateGroups="(3,1), (7,4)" />
        <slider name="E" restrictToCollaborateGroups="(3,2), (7,5)" />
        <slider name="F" />
        <slider name="G" />

