Write - Mod
!agenda '<step 1>' <step 2> --> Store the steps somewhere
Read - any user
!agenda --> List steps in chat


!agenda First Second Third
!agenda 'First Step' 'Second Step' 'Third Step'


- Stores one agenda
- Supports 'single-word' steps

Check for !agenda command
- If args exist
  - Verify mod user
    - mod user: parse, store agenda and output existing agenda
    - !mod user: notify user of permission error and output existing agenda
- If args !exist
  - Output existing displayName


//Check for !agenda
//Parse args
//If args exist
  //If mod user
    //Store agenda
  //Else !mod user
    //Notify of permission error
//Output agenda to chat
