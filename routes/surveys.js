const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const { v4 } = require('uuid');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

//@route GET api/surveys/:id
//@desc get survey entries
//@access Public
router.get('/', async (req, res) => {
    try {
        knex.select()
            .from('surveys').then((surveys) => {
                res.send(surveys[0])
            })
    } catch (err) {
        console.log(err.message);
        res.status(500).send("Server Error")
    }
});

//@route Post api/survey
//@desc Add new survey
//@access Private
router.post('/', [
    check('counsellor_name', 'Counsellor name is required')
        .not().isEmpty()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const {
            site_name,
            site_type,
            sub_district,
            date,
            time_in,
            counsellor_name,
            client_name_and_surname,
            gender,
            birth_date,
            last_tested,
            age_at_intake,
            grade,
            race,
            mobile,
            consent_to_sms,
            home_phone_number,
            client_community,
            first_time_doing_HIV_test,
            first_time_with_LC,
            number_times_tested,
            last_HIV_test,
            last_test_result,
            scheduled_follow_up_test,
            signature,
            client_on_TB_med,
            TB_symptoms,
            TB_screening_result,
            has_client_ever_had_sex,
            kind_of_sex,
            last_had_unprotected_sex,
            blood_contact,
            STI_symptoms,
            STI_screening_result,
            time_out,
            sales_force_client_code,
            recieved_test_results,
            reason_for_no_result,
            risks_number,
            what_steps,
            step1_action_plan,
            step2_action_plan,
            step3_action_plan,
            step4_action_plan,
            HIV_test_results,
            test1_type,
            test1_lot_number,
            test1_results,
            test2_type,
            test2_lot_number,
            test2_results,
            test3_type,
            test3_lot_number,
            test3_results,
            maintance_plan,
            client_risk1,
            client_risk2,
            client_risk3,
            client_risk1_stage,
            client_risk2_stage,
            client_risk3_stage,
            referred,
            referral_point,
            referral_reason,
            end_of_window_period,
            follow_up_required,
            follow_up_reason,
            follow_up_date,
            // user_id = knex.from('users').select('id')
        } = req.body;

        const record = {
            id: v4(),
            site_name,
            site_type,
            sub_district,
            date,
            time_in,
            counsellor_name,
            client_name_and_surname,
            gender,
            birth_date,
            last_tested,
            age_at_intake,
            grade,
            race,
            mobile,
            consent_to_sms,
            home_phone_number,
            client_community,
            first_time_doing_HIV_test,
            first_time_with_LC,
            number_times_tested,
            last_HIV_test,
            last_test_result,
            scheduled_follow_up_test,
            signature,
            client_on_TB_med,
            TB_symptoms,
            TB_screening_result,
            has_client_ever_had_sex,
            kind_of_sex,
            last_had_unprotected_sex,
            blood_contact,
            STI_symptoms,
            STI_screening_result,
            time_out,
            sales_force_client_code,
            recieved_test_results,
            reason_for_no_result,
            risks_number,
            what_steps,
            step1_action_plan,
            step2_action_plan,
            step3_action_plan,
            step4_action_plan,
            HIV_test_results,
            test1_type,
            test1_lot_number,
            test1_results,
            test2_type,
            test2_lot_number,
            test2_results,
            test3_type,
            test3_lot_number,
            test3_results,
            maintance_plan,
            client_risk1,
            client_risk2,
            client_risk3,
            client_risk1_stage,
            client_risk2_stage,
            client_risk3_stage,
            referred,
            referral_point,
            referral_reason,
            end_of_window_period,
            follow_up_required,
            follow_up_reason,
            follow_up_date,
            // user_id
        }
        knex('surveys').insert(record)
            .then(function () {
                res.json({ msg: "Survey entry added!" });
            })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

//@route GET api/:id
//@desc Get user's entries
//@access Private
router.get('/:id', auth, (req, res) => {
    try {
        knex.from('surveys')
            .where('surveys.user_id', req.params.id)
            .then(function (surveys) {
                res.send(surveys)
            })
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

//@route DELETE api/surveys/:id
//@desc Delete surveys
//@access Private
router.delete('/:id', auth, async(req, res) =>{
    try {
      let exists = await knex.select().from('surveys').where('id', req.params.id).then((survey) => { return survey[0] });
      if(!exists){
          return res.status(400).json({msg: 'Survey Entry not Found!'});
      }
      knex('surveys').where('id', req.params.id)
      .del().then(function(){
      res.json({msg:'Survey Entry Removed!'});
    })
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  })
  
  module.exports = router;