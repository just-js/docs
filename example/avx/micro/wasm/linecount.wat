(module
 (type $none_=>_i32 (func (result i32)))
 (type $none_=>_none (func))
 (type $i32_=>_none (func (param i32)))
 (type $i32_=>_i32 (func (param i32) (result i32)))
 (type $i32_i32_i32_=>_i32 (func (param i32 i32 i32) (result i32)))
 (import "env" "memory" (memory $mimport$0 256 256))
 (global $global$0 (mut i32) (i32.const 66576))
 (table $0 2 2 funcref)
 (elem (i32.const 1) $0)
 (export "memcount_sse2" (func $5))
 (export "_initialize" (func $0))
 (export "__indirect_function_table" (table $0))
 (export "__errno_location" (func $4))
 (export "stackSave" (func $1))
 (export "stackRestore" (func $2))
 (export "stackAlloc" (func $3))
 (func $0
 )
 (func $1 (result i32)
  (global.get $global$0)
 )
 (func $2 (param $0 i32)
  (global.set $global$0
   (local.get $0)
  )
 )
 (func $3 (param $0 i32) (result i32)
  (global.set $global$0
   (local.tee $0
    (i32.and
     (i32.sub
      (global.get $global$0)
      (local.get $0)
     )
     (i32.const -16)
    )
   )
  )
  (local.get $0)
 )
 (func $4 (result i32)
  (i32.const 1024)
 )
 (func $5 (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 v128)
  (local $4 v128)
  (local $5 v128)
  (local $6 v128)
  (local $7 v128)
  (local $8 v128)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (block $label$1
   (if
    (i32.eq
     (local.tee $11
      (i32.rem_u
       (local.get $2)
       (i32.const 4032)
      )
     )
     (local.get $2)
    )
    (block
     (local.set $10
      (local.get $0)
     )
     (br $label$1)
    )
   )
   (local.set $10
    (i32.add
     (local.get $0)
     (i32.sub
      (local.get $2)
      (local.get $11)
     )
    )
   )
   (local.set $5
    (i8x16.splat
     (local.get $1)
    )
   )
   (local.set $11
    (local.get $0)
   )
   (loop $label$3
    (local.set $12
     (i32.const 0)
    )
    (local.set $9
     (local.get $11)
    )
    (local.set $7
     (local.tee $6
      (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
     )
    )
    (local.set $8
     (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
    )
    (local.set $4
     (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
    )
    (loop $label$4
     (local.set $4
      (i8x16.add
       (local.get $4)
       (i8x16.eq
        (local.get $5)
        (v128.load offset=48 align=1
         (local.get $9)
        )
       )
      )
     )
     (local.set $8
      (i8x16.add
       (local.get $8)
       (i8x16.eq
        (local.get $5)
        (v128.load offset=32 align=1
         (local.get $9)
        )
       )
      )
     )
     (local.set $7
      (i8x16.add
       (local.get $7)
       (i8x16.eq
        (local.get $5)
        (v128.load offset=16 align=1
         (local.get $9)
        )
       )
      )
     )
     (local.set $6
      (i8x16.add
       (local.get $6)
       (i8x16.eq
        (local.get $5)
        (v128.load align=1
         (local.get $9)
        )
       )
      )
     )
     (local.set $9
      (i32.add
       (local.get $11)
       (local.tee $12
        (i32.sub
         (local.get $12)
         (i32.const -64)
        )
       )
      )
     )
     (br_if $label$4
      (i32.ne
       (local.get $12)
       (i32.const 4032)
      )
     )
    )
    (local.set $3
     (i64x2.add
      (i64x2.add
       (i64x2.add
        (i64x2.add
         (i64x2.shr_u
          (i16x8.add
           (local.tee $4
            (i16x8.add
             (local.tee $4
              (i16x8.add
               (v128.and
                (local.tee $4
                 (v128.or
                  (i8x16.sub_sat_u
                   (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
                   (local.tee $4
                    (i8x16.neg
                     (local.get $4)
                    )
                   )
                  )
                  (i8x16.sub_sat_u
                   (local.get $4)
                   (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
                  )
                 )
                )
                (v128.const i32x4 0x00ff00ff 0x00ff00ff 0x00ff00ff 0x00ff00ff)
               )
               (i16x8.shr_u
                (local.get $4)
                (i32.const 8)
               )
              )
             )
             (i32x4.shl
              (local.get $4)
              (i32.const 16)
             )
            )
           )
           (i64x2.shl
            (local.get $4)
            (i32.const 32)
           )
          )
          (i32.const 48)
         )
         (local.get $3)
        )
        (i64x2.shr_u
         (i16x8.add
          (local.tee $3
           (i16x8.add
            (local.tee $3
             (i16x8.add
              (v128.and
               (local.tee $3
                (v128.or
                 (i8x16.sub_sat_u
                  (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
                  (local.tee $3
                   (i8x16.neg
                    (local.get $8)
                   )
                  )
                 )
                 (i8x16.sub_sat_u
                  (local.get $3)
                  (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
                 )
                )
               )
               (v128.const i32x4 0x00ff00ff 0x00ff00ff 0x00ff00ff 0x00ff00ff)
              )
              (i16x8.shr_u
               (local.get $3)
               (i32.const 8)
              )
             )
            )
            (i32x4.shl
             (local.get $3)
             (i32.const 16)
            )
           )
          )
          (i64x2.shl
           (local.get $3)
           (i32.const 32)
          )
         )
         (i32.const 48)
        )
       )
       (i64x2.shr_u
        (i16x8.add
         (local.tee $3
          (i16x8.add
           (local.tee $3
            (i16x8.add
             (v128.and
              (local.tee $3
               (v128.or
                (i8x16.sub_sat_u
                 (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
                 (local.tee $3
                  (i8x16.neg
                   (local.get $7)
                  )
                 )
                )
                (i8x16.sub_sat_u
                 (local.get $3)
                 (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
                )
               )
              )
              (v128.const i32x4 0x00ff00ff 0x00ff00ff 0x00ff00ff 0x00ff00ff)
             )
             (i16x8.shr_u
              (local.get $3)
              (i32.const 8)
             )
            )
           )
           (i32x4.shl
            (local.get $3)
            (i32.const 16)
           )
          )
         )
         (i64x2.shl
          (local.get $3)
          (i32.const 32)
         )
        )
        (i32.const 48)
       )
      )
      (i64x2.shr_u
       (i16x8.add
        (local.tee $3
         (i16x8.add
          (local.tee $3
           (i16x8.add
            (v128.and
             (local.tee $3
              (v128.or
               (i8x16.sub_sat_u
                (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
                (local.tee $3
                 (i8x16.neg
                  (local.get $6)
                 )
                )
               )
               (i8x16.sub_sat_u
                (local.get $3)
                (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
               )
              )
             )
             (v128.const i32x4 0x00ff00ff 0x00ff00ff 0x00ff00ff 0x00ff00ff)
            )
            (i16x8.shr_u
             (local.get $3)
             (i32.const 8)
            )
           )
          )
          (i32x4.shl
           (local.get $3)
           (i32.const 16)
          )
         )
        )
        (i64x2.shl
         (local.get $3)
         (i32.const 32)
        )
       )
       (i32.const 48)
      )
     )
    )
    (br_if $label$3
     (i32.ne
      (local.tee $11
       (local.get $9)
      )
      (local.get $10)
     )
    )
   )
  )
  (local.set $9
   (i32.wrap_i64
    (i64.add
     (i64x2.extract_lane 0
      (local.get $3)
     )
     (i64x2.extract_lane 1
      (local.get $3)
     )
    )
   )
  )
  (block $label$5
   (br_if $label$5
    (i32.eq
     (local.get $10)
     (local.tee $2
      (i32.add
       (local.get $0)
       (local.get $2)
      )
     )
    )
   )
   (if
    (i32.ge_u
     (local.tee $11
      (i32.sub
       (local.get $2)
       (local.get $10)
      )
     )
     (i32.const 4)
    )
    (block
     (local.set $3
      (i32x4.replace_lane 0
       (v128.const i32x4 0x00000000 0x00000000 0x00000000 0x00000000)
       (local.get $9)
      )
     )
     (local.set $0
      (i32.and
       (local.get $11)
       (i32.const -4)
      )
     )
     (local.set $5
      (i32x4.splat
       (local.get $1)
      )
     )
     (local.set $9
      (i32.const 0)
     )
     (loop $label$7
      (local.set $3
       (i32x4.sub
        (local.get $3)
        (i32x4.eq
         (local.get $5)
         (i32x4.extend_low_i16x8_s
          (i16x8.extend_low_i8x16_s
           (v128.load32_zero align=1
            (i32.add
             (local.get $9)
             (local.get $10)
            )
           )
          )
         )
        )
       )
      )
      (br_if $label$7
       (i32.ne
        (local.tee $9
         (i32.add
          (local.get $9)
          (i32.const 4)
         )
        )
        (local.get $0)
       )
      )
     )
     (local.set $9
      (i32x4.extract_lane 0
       (i32x4.add
        (local.tee $3
         (i32x4.add
          (local.get $3)
          (i8x16.shuffle 8 9 10 11 12 13 14 15 0 1 2 3 0 1 2 3
           (local.get $3)
           (local.get $3)
          )
         )
        )
        (i8x16.shuffle 4 5 6 7 0 1 2 3 0 1 2 3 0 1 2 3
         (local.get $3)
         (local.get $3)
        )
       )
      )
     )
     (br_if $label$5
      (i32.eq
       (local.get $0)
       (local.get $11)
      )
     )
     (local.set $10
      (i32.add
       (local.get $0)
       (local.get $10)
      )
     )
    )
   )
   (loop $label$8
    (local.set $9
     (i32.add
      (local.get $9)
      (i32.eq
       (i32.load8_s
        (local.get $10)
       )
       (local.get $1)
      )
     )
    )
    (br_if $label$8
     (i32.ne
      (local.tee $10
       (i32.add
        (local.get $10)
        (i32.const 1)
       )
      )
      (local.get $2)
     )
    )
   )
  )
  (local.get $9)
 )
)

